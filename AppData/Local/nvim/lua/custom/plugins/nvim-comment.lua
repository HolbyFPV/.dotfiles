return {
    "terrortylor/nvim-comment",
    keys = {
        { "<C-_>", "<CMD>CommentToggle<CR>j",             mode = { "n" } },
        { "<C-_>", "<C-\\><C-N><CMD>CommentToggle<CR>ji", mode = { "i" } },
        { "<C-_>", ":'<,'>CommentToggle<CR>gv<esc>j",     mode = { "v" } },
    },
    config = function()
        require("nvim_comment").setup()
    end
}
