<script lang="ts">
import dayjs from 'dayjs'
import { defineComponent } from 'vue'

export const TITLE = 'Fastest Node.js Fizzbuzz'
export const CREATED_AT = dayjs.utc('2022-06-24').unix()

export default defineComponent({
    setup() {
        return {
            TITLE,
            CREATED_AT,
        }
    },
})
</script>

<template>
    <BlogPost
        :title="TITLE"
        :created-at="CREATED_AT"
    >
        <p>
            I recently encountered an <a href="https://codegolf.stackexchange.com/questions/215216/high-throughput-fizz-buzz/248988">interesting thread on CodeGolf</a> that asked for the fastest implementation of everybody's favorite interview question FizzBuzz.
            Unsurprisingly, the fastest were written in Assembly and C that optimized their use of cache lines and syscalls.
        </p>

        <p>
            In that thread, there were also some people who were curious on how fast other languages can be when pushed to their limits. Surprisingly nobody has attempted with JavaScript yet, at least not one with a valid solution.
        </p>

        <TextHeading>
            Testing Methodology
        </TextHeading>

        <p>
            All tests were run with the command <code>node.js main.js | pv > /dev/null</code> on my machine with Ryzen 2600 and Node.js 18.4.0.
        </p>

        <TextHeading>
            Basic Implementation
        </TextHeading>

        <p>
            This is the basic FizzBuzz that everybody knows and love.
        </p>

        <CodeBlock
            :code="require('./raw/0-basic.js')"
            language="js"
        />

        <p>
            However, this is not a valid solution for this particular challenge since the author wanted solutions that can execute up to <code>2^63-1</code>.
            In JavaScript, the maximum safe integer value that can be stored in a native <code>number</code> (which is basically a double precision float) is <code>2^53-1</code>.
            To fix this issue, we have to use the <code>BigInt</code> datatype introduced in Node.js 10.4.0.
        </p>

        <CodeBlock
            :code="require('./raw/1-bigint.js')"
            language="js"
        />

        <p>
            Running this baseline implementation yields around <strong>1 MiB/s</strong>.
        </p>

        <TextHeading>
            Remove Branches
        </TextHeading>

        <p>
            One property of FizzBuzz is that it is cyclic every 15 integers.
            The first optimization that we can make is to simply remove all the branches (if-statements) and unroll every 15 iterations.
        </p>

        <CodeBlock
            :code="require('./raw/2-no-branch.js')"
            language="js"
        />

        <p>
            Running this implementation yields around <strong>10 MiB/s</strong>.
        </p>

        <TextHeading>
            Remove <code>console.log</code>
        </TextHeading>

        <p>
            Next, we can use <code>process.stdout.write</code> to directly write to the output stream and bypass the formatter logic inside <code>console.log</code>.
        </p>

        <CodeBlock
            :code="require('./raw/3-no-console-log.js')"
            language="js"
        />

        <p>
            Running this implementation yields around <strong>30 MiB/s</strong>.
        </p>

        <TextHeading>
            Remove <code>process.stdout.write</code>
        </TextHeading>

        <p>
            Another caveat of Node.js is that whenever we are writing to <code>stdout</code>, the main thread gets blocked until the write finishes.
            Internally, each write is an expensive system call.
            To minimize these write calls, we can batch what we want to write until our buffer is full.
        </p>

        <CodeBlock
            :code="require('./raw/4-string-buffer.js')"
            language="js"
        />

        <p>
            Running this implementation yields around <strong>100 MiB/s</strong>.
        </p>

        <TextHeading>
            Out of Memory Errors
        </TextHeading>

        <p>
            One thing I noticed while testing the previous implementations is that after a few minutes they will run out of memory and crash.
        </p>

        <CodeBlock
            :code="require('./raw/oom.txt')"
        />

        <p>
            Since we clearly do not have any dangling references or memory leaks, we can only conclude that V8's garbage collector fails to free up all the temporary strings.
            The error log states that the garbage collector executes every 4 seconds but fails to free up more than 5 MB each time.
            Since these implementations generate upwards of 100 MiB/s worth of strings, it's possible that the garbage collector simply does not have enough time budgeted to free up all the unused strings.
        </p>

        <TextHeading>
            Memory Safe Implementation
        </TextHeading>

        <p>
            Since the challenge is to implement something that can, in theory, execute on all <code>2^63-1</code> integers given enough time, we need a solution that doesn't run out of memory after only a few minutes.
        </p>

        <p>
            Since strings are too problematic, I decided to use a fixed binary buffer and avoid as much non-stack allocations as possible.
            This buffer is explicitly allocated once and is simply reused by resetting the offset counter.
            The only heap object allocated is where I called <code>subarray</code> which returns a new <code>Buffer</code> object. Since this new buffer object internally points to the same memory location as the original buffer, the overall the heap impact should be marginal and is unlikely to exceed our hypothesized 5 MB per 4 second garbage collector time budget.
        </p>

        <CodeBlock
            :code="require('./raw/6-buffer.js')"
            language="js"
        />

        <p>
            This implementation runs at an astounding <strong>8 MiB/s</strong>.
            Yes, this is not a typo.
            We went from 100 back down to 8!
        </p>

        <p>
            This is a huge regression but, at the same time, it's not that surprising.
            Running a profiler on this code reveals the biggest bottleneck is the <code>BigInt</code> division and modulo operations used to calculate the i-th decimal digit for printing non-fizzbuzz numbers.
            Since <code>BigInt</code> is designed to work on arbitrarily large numbers, it must use software-based division algorithms instead of hardware-based 64-bit division instructions.
        </p>

        <TextHeading>
            Worker Threads
        </TextHeading>

        <p>
            Another property of FizzBuzz is that it is trivially parallelizable since the result for one number is independant of every other number.
            Well... not quite.
            This challenge also stipulates that we cannot have null bytes in our output.
            Since different numbers have different number of digits, their locations in our buffer will be dependant on every previous number.
        </p>

        <p>
            We can still make use of the data-independance of FizzBuzz by delegating each thread to work on a different batch of numbers.
            For example, thread 1 works on [0, 3000), thread 2 works on [3000, 6000), thread 3 works on [6000, 9000), etc.
            Inside each thread, we execute sequentially to pack the thread-specific output buffer.
            Finally, we round-robin print each thread's buffer in our main thread.
        </p>

        <CodeBlock
            :code="require('./raw/7-worker-threads.js')"
            language="js"
        />

        <p>
            Putting everything that we have learned together, we have arrived at this implementation that runs at around <strong>370 MiB/s</strong>.
            Not bad considering our starting base implementation runs at <strong>1 MiB/s</strong>!
        </p>

        <TextHeading>
            Final Thoughts
        </TextHeading>

        <ul>
            <li>
                Node.js' garbage collector sucks.
            </li>
            <li>
                Buffer system calls in memory as long as possible.
            </li>
            <li>
                <code>BigInt</code> is insanely expensive.
                If you need to process integers larger than <code>2^53-1</code>, you should consider using WebAssembly or native modules with access to hardware 64-bit integers.
                I used pure JavaScript for this challenge because I felt loading modules written in other languages defeats the spirit of the contest for language-specific implementions.
                Otherwise, every language's fastest implementation will just be a thin wrapper around C modules.
            </li>
        </ul>
    </BlogPost>
</template>
