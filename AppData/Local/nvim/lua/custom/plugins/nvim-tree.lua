return {
    "nvim-tree/nvim-tree.lua",
    version = "*",
    lazy = false,
    dependencies = {
        "nvim-tree/nvim-web-devicons",
    },
    keys = {
        -- { "<c-b>", ":NvimTreeToggle<CR>" }
        { "<Leader>t", ":NvimTreeToggle<CR>" }
    },
    config = function()
        require("nvim-tree").setup({
            sort_by = "case_sensitive",
            view = {
                width = 15,
                adaptive_size = true,
                signcolumn = 'no',
                side = 'right',
                preserve_window_proportions = true
            },
            renderer = {
                group_empty = true,
            },
            filters = {
                dotfiles = false,
            },
            actions = {
                open_file = {
                    quit_on_open = true,
                },
            }
        })
    end
}
