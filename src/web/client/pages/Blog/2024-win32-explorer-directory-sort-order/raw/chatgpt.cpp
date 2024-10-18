IFolderView2* GetDirectoryFolderView(const std::filesystem::path& directory) {
    IShellFolder* desktopFolder = nullptr;
    SHGetDesktopFolder(&desktopFolder);

    ITEMIDLIST* idl = nullptr;
    desktopFolder->ParseDisplayName(nullptr, nullptr, (LPWSTR)directory.wstring().c_str(), nullptr, &idl, nullptr);

    IShellFolder* targetFolder = nullptr;
    desktopFolder->BindToObject(idl, nullptr, IID_PPV_ARGS(&targetFolder));

    IShellView* targetShellView = nullptr;
    targetFolder->CreateViewObject(nullptr, IID_PPV_ARGS(&targetShellView));

    IFolderView2* targetFolderView = nullptr;
    targetShellView->QueryInterface(IID_PPV_ARGS(&targetFolderView));

    return targetFolderView;
}
