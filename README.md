<div align="center">

# 🏠 .dotfiles

managed by [`chezmoi`](https://github.com/twpayne/chezmoi)

</div>

![ba6ea70323ce5609ae0a3e983837181d](https://github.com/HolbyFPV/dotfiles/assets/61704528/1c77fd12-048c-4a33-9228-5ef715efcc97)

# Install

Install Scoop, Git, and MinGW (using Powershell)

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser;
irm get.scoop.sh | iex;
scoop install main/git;
```

Setup git

```shell
ssh-keygen -t rsa -b 4096 && \
eval `ssh-agent` && \
ssh-add ~/.ssh/id_rsa && \
git config --global user.name "holby" && \
git config --global user.email "holbyfpv@gmail.com" && \
cat ~/.ssh/id_rsa.pub
```

Install

```shell
scoop install main/chezmoi && \
chezmoi init --apply git@github.com:HolbyFPV/.dotfiles.git
```

# Scoop 

### Buckets

```shell
scoop bucket add extras && \
scoop bucket add versions && \
scoop bucket add nerd-fonts && \
scoop bucket add games && \
```

## Stuff 

```shell
scoop install nerd-fonts/JetBrains-Mono && \
scoop install main/winfetch && \
scoop install main/starship && \
scoop install extras/wezterm && \
scoop install extras/obsidian && \ 
scoop install extras/revouninstaller && \
scoop install extras/firefox && \
scoop install extras/vlc && \
scoop install extras/glazewm && \
scoop install extras/powertoys && \
scoop install extras/flow-launcher && \
scoop install extras/twinkle-tray && \
scoop install extras/openrgb && \
scoop install extras/lively && \
scoop install extras/spotify && \
scoop install versions/steam && \
```

## Dev

```shell
scoop install games/epic-games-launcher  && \
scoop install extras/jetbrains-toolbox && \
scoop install extras/vscode && \
scoop install extras/gitextensions && \
scoop install extras/qmk-toolbox && \
scoop install main/git && \
scoop install main/rustup && \
scoop install main/pnpm && \
scoop install main/dotnet-sdk && \
scoop install main/docker && \
scoop install main/pyenv && \
```

## Neovim
```shell
scoop install main/neovim && \
scoop install main/pwsh && \ 
scoop install main/nvm && \
scoop install main/ripgrep && \ 
scoop install main/fd && \
scoop install main/clangd && \
scoop install versions/mingw-winlibs-llvm && \
```
```shell
nvm install latest && \
nvm use latest && \
```


## Chat

```shell
scoop install extras/discord && \
scoop install extras/microsoft-teams && \
scoop install extras/slack && \
```

## FPV/3D

```shell
scoop install extras/betaflight-configurator && \
scoop install extras/betaflight-blackbox-explorer && \
scoop install extras/cura && \
scoop install extras/prusaslicer && \
```

# Theme (holby-dark)

[Firefox](https://addons.mozilla.org/en-US/firefox/addon/holby-github-dark/)

[Jetbrains](https://plugins.jetbrains.com/plugin/22825-holby-dark)
