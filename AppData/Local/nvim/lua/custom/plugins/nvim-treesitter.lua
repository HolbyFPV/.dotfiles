return {
    "nvim-treesitter/nvim-treesitter",
    build = ":TSUpdate",
    dependencies = {
        { 'nvim-treesitter/nvim-treesitter-context', opts = { enable = true, mode = "topline" } }
    },
    config = function()
        require 'nvim-treesitter.install'.compilers = { "clang" }
        require("nvim-treesitter.configs").setup {
            ensure_installed = { "c", "cpp", "c_sharp", "html", "lua", "rust", "javascript" },
            highlight = { enable = true, },
            auto_install = true
        }
    end
}
