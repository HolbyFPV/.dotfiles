return {
    'projekt0n/github-nvim-theme',
    lazy = false,    -- make sure we load this during startup if it is your main colorscheme
    priority = 1000, -- make sure to load this before all the other start plugins
    config = function()
        require('github-theme').setup({
            options = {
                terminal_colors = false,
                transparent = true,
                darken = {
                    sidebars = {
                        enable = false
                    }
                },
                hide_nc_statusline = true,
            },
            palettes = {
                -- Custom duskfox with black background
                github_dark = {
                    -- bg = '#010409',
                    bg = '#161b22',
                    bg1 = '#1c2128',   -- Black background
                    bg0 = '#89929b',   -- Alt backgrounds (floats, statusline, ...)
                    bg3 = '#1c2128',   -- 55% darkened from stock
                    sel0 = '#ffa752',  -- 55% darkened from stock
                    green = '#7ce38b', -- 55% darkened from stock
                    blue2 = '#a2d2fb', -- 55% darkened from stock
                    red = '#fa7970',   -- 55% darkened from stock
                },
            },
            specs = {
                all = {
                    inactive = 'bg1', -- Default value for other styles
                },
                github_dark_dimmed = {
                    inactive = '#090909', -- Slightly lighter then black background
                },
            },
            groups = {
                all = {
                    -- Normal = { bg = 'palette.bg1' }, -- Non-current windows
                    -- NormalNC = { bg = 'palette.bg1' }, -- Non-current windows
                    CursorLineNr = { fg = '#7ce38b' },                     -- Non-current windows
                    Visual = { fg = 'palette.bg1', bg = 'palette.green' }, -- Non-current windows
                    -- FloatTitle = { fg='palette.green' }, -- Non-current windows
                    -- FloatBorder = { fg='palette.green' }, -- Non-current windows
                    -- NormalFloat = { bg = 'palette.bg1' }, -- Non-current windows
                    PmenuSel = { bg = 'palette.green', fg = 'palette.bg1' },           -- Non-current windows
                    -- TelescopeSelection = { bg = 'palette.green', fg = 'palette.bg1' }, -- Non-current windows
                    TelescopeMatching = { fg = 'palette.green' },                      -- Non-current windows
                    TelescopeTitle = { fg = 'palette.green' },                         -- Non-current windows
                    TelescopeSelectionCaret = { fg = 'palette.green' },                -- Non-current windows
                    HarpoonBorder = { fg = 'palette.green' },                          -- Non-current windows
                    TelescopeBorder = { fg = 'palette.green' },                        -- Non-current windows
                    NvimTreeCursorLine = { bg = 'palette.green', fg = 'palette.bg1' }, -- Non-current windows
                    NvimTreeNormal = { bg = 'palette.bg1' },                           -- Non-current windows
                    VertSplit = { fg = 'palette.bg0' },                                -- Non-current windows
                    StatusLineNC = { fg = 'palette.bg0', bg = 'palette.bg1' },         -- Non-current windows
                    GitSignsAdd = { fg = 'palette.green' },                            -- Non-current windows
                    GitSignsChange = { fg = 'palette.blue2' },                         -- Non-current windows
                    GitSignsDelete = { fg = 'palette.red' },                           -- Non-current windows
                    StatusLine = { bg = 'palette.bg1' },
                    TreesitterContext = { bg = 'palette.bg' },
                    Search = { fg = '#00ffcb', bg = '#212934' },
                    IncSearch = { fg = '#00ffcb', bg = '#212934' },
                    CurSearch = { fg = '#00ffcb', bg = '#212934' },
                },
            },
        })
        -- vim.cmd('colorscheme github_dark_tritanopia')
        vim.cmd('colorscheme github_dark')
        vim.cmd('hi! lualine_transitional_lualine_a_insert_to_StatusLine guibg=none')
        vim.cmd('hi! lualine_transitional_lualine_a_visual_to_StatusLine guibg=none')
        vim.cmd('hi! lualine_transitional_lualine_a_normal_to_StatusLine guibg=none')
    end
}
