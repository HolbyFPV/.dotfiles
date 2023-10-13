return {
    "fedepujol/move.nvim",
    keys = {
        { "<C-j>", ":MoveLine(1)<CR>",              mode = { "n" } },
        { "<C-k>",   ":MoveLine(-1)<CR>",             mode = { "n" } },
        { "<C-j>", ":MoveBlock(1)<CR>",             mode = { "v" } },
        { "<C-k>",   ":MoveBlock(-1)<CR>",            mode = { "v" } },
        { "<C-j>", "<C-\\><C-N>:MoveLine(1)<CR>i",  mode = { "i" } },
        { "<C-k>",   "<C-\\><C-N>:MoveLine(-1)<CR>i", mode = { "i" } },
    }
}
