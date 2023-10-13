-------------------------------------------------------------------------------
-- Options
-------------------------------------------------------------------------------
vim.g.loaded_netrw = 1
vim.g.loaded_netrwPlugin = 1 -- #  .pyenv\pyenv-win\versions\3.7.4
-- C:\Users\justi\AppData\Local\Microsoft\WindowsApps\python3.exe
-- vim.g.python3_host_prog = '/c/Users/justi/AppData/Local/Microsoft/WindowsApps/python3.exe'
vim.g.python3_host_prog = 'python3'
vim.opt.clipboard = "unnamedplus"
vim.opt.ignorecase = true
vim.opt.number = true
vim.opt.smartindent = true
vim.opt.expandtab = true
vim.opt.tabstop = 4
vim.opt.shiftwidth = 4
vim.opt.laststatus = 3
vim.opt.cmdheight = 0
vim.opt.numberwidth = 4
vim.opt.signcolumn = 'yes' -- Disable the sign column
vim.wo.wrap = false
vim.o.scrolloff = 8
vim.wo.relativenumber = true
vim.opt.fillchars = { eob = " " }
vim.wo.cursorline = true
vim.wo.cursorlineopt = "number"
vim.wo.foldmethod = "expr"
vim.opt.foldenable = false
vim.wo.foldexpr = "nvim_treesitter#foldexpr()"
vim.wo.foldtext = [[substitute(getline(v:foldstart),'\\t',repeat('\ ',&tabstop),'g').'...'.trim(getline(v:foldend)) ]]
vim.wo.fillchars = "fold:\\"
vim.wo.foldnestmax = 3
vim.wo.foldminlines = 1

-------------------------------------------------------------------------------
-- Keybinds
-------------------------------------------------------------------------------
require "keymap"

-------------------------------------------------------------------------------
-- Lazy (plugin manager)
-------------------------------------------------------------------------------
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
vim.opt.rtp:prepend(lazypath)
if not vim.loop.fs_stat(lazypath) then
    print("Installing 'folke/lazy.nvim'...")
    vim.fn.system({ "git", "clone", "https://github.com/folke/lazy.nvim.git", lazypath })
end

-- highlight yanked text for 200ms using the "Visual" highlight group
vim.cmd [[
    augroup highlight_yank
    autocmd!
    au TextYankPost * silent! lua vim.highlight.on_yank({higroup="@text.note", timeout=1500})
    augroup END
]]

require("lazy").setup {
    { import = 'custom.plugins' },
}
