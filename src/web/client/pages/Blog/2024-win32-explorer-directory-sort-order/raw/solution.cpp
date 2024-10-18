static HWND targetExplorerWindowHandle = GetForegroundWindow();

IFolderView2* GetDirectoryFolderView(const std::filesystem::path& directory) {
    CoInitializeEx(nullptr, COINIT_MULTITHREADED);

    IShellWindows* shellWindows = nullptr;
    CoCreateInstance(CLSID_ShellWindows, nullptr, CLSCTX_ALL, IID_PPV_ARGS(&shellWindows));

    IDispatch* dispatch = [&]() {
        long numWindows = -1;
        shellWindows->get_Count(&numWindows);

        for (int i = 0; i < numWindows; i++) {
            VARIANT idx = {0};
            V_VT(&idx) = VT_I4;
            V_I4(&idx) = i;

            IDispatch* dispatch = nullptr;
            shellWindows->Item(idx, &dispatch);

            // Interally, Explorer.exe implements web browser interface (Internet Explorer) since they share many common functionality
            IWebBrowserApp* browser = nullptr;
            dispatch->QueryInterface(IID_PPV_ARGS(&browser));

            if (targetExplorerWindowHandle) {
                HWND browserHandle = nullptr;
                browser->get_HWND((SHANDLE_PTR*)&browserHandle);
                if (targetExplorerWindowHandle != browserHandle) {
                    continue;
                }
            }

            // Return first Explorer.exe that's inside our target directory
            if (IsBrowserInDirectory(browser, directory)) {
                return dispatch;
            }
        }

        return nullptr;
    }();

    IServiceProvider* serviceProvider = nullptr;
    dispatch->QueryInterface(IID_PPV_ARGS(&serviceProvider));

    IShellBrowser* shellBrowser = nullptr;
    serviceProvider->QueryService(SID_STopLevelBrowser, IID_PPV_ARGS(&shellBrowser));

    IShellView* shellView = nullptr;
    shellBrowser->QueryActiveShellView(&shellView);

    IFolderView2* folderView = nullptr;
    shellView->QueryInterface(IID_PPV_ARGS(&folderView));

    return folderView;
}

static bool IsBrowserInDirectory(IWebBrowserApp* browser, const std::filesystem::path& directory) {
    wchar_t* url16 = nullptr;
    browser->get_LocationURL(&url16);

    auto path16 = ConvertUrlToPath(url16);
    auto explorerPath = std::filesystem::path(path16);
    auto isEquivalent = std::filesystem::equivalent(directory, explorerPath);
    return isEquivalent;
}

static std::wstring ConvertUrlToPath(wchar_t* url) {
    wchar_t buffer[MAX_PATH] = {0};
    DWORD bufferSize = MAX_PATH;
    PathCreateFromUrlW(url, (wchar_t*)&buffer, &bufferSize, 0);
    return std::wstring(buffer, bufferSize);
}
