declare const brand: unique symbol

export type BrandedType<RuntimeType, BrandName> = RuntimeType & { [brand]: BrandName }
