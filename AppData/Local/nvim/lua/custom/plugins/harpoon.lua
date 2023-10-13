return {
    "thePrimeagen/harpoon",
    cmd = "Harpoon",
    config = function()
        require("harpoon").setup {}
    end,
    dependencies = {
        { "nvim-lua/plenary.nvim" },
        { "nvim-lua/popup.nvim" },
    }
}
