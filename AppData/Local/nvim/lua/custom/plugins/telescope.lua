return {
    "nvim-telescope/telescope.nvim",
    -- branch = "0.1.x",
    cmd = "Telescope",
    dependencies = "nvim-lua/plenary.nvim",
    keys = {
        { "<C-t>",     "<CMD>Telescope<CR>",             mode = { "n", "v" } },
        -- { "<C-p>", "<CMD>Telescope find_files<CR>",  mode = { "n", "v" } },
        { "<Leader>f", "<CMD>Telescope find_files<CR>",  mode = { "n", "v" } },
        -- { "<C-l>", "<CMD>Telescope live_grep<CR>",   mode = { "n", "v" } },
        { "<Leader>g", "<CMD>Telescope live_grep<CR>",   mode = { "n", "v" } },
        { "<Leader>s", "<CMD>Telescope oldfiles<CR>",    mode = { "n", "v" } },
        { "<C-c>",     "<CMD>Telescope commands<CR>",    mode = { "n", "v" } },
        { "<C-k>",     "<CMD>Telescope keymaps<CR>",     mode = { "n", "v" } },
        { "<C-s>",     "<CMD>Telescope grep_string<CR>", mode = { "n", "v" } },
    },
    config = function()
        local actions = require "telescope.actions"
        require('telescope').setup({
            defaults = {
            }
        })
    end
}
