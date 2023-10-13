return {
    "nvim-lualine/lualine.nvim",
    config = function()
        -- Bubbles config for lualine
        -- Author: lokesh-krishna
        -- MIT license, see LICENSE for more details.
        -- stylua: ignore
        local colors = {
            blue   = '#80a0ff',
            cyan   = '#a2d2fb',
            -- cyan   = '#79dac8',#a2d2fb
            black  = '#1c2128',
            -- black2 = '#161b22',#21262d
            black2 = '#21262d',
            white  = '#c6cdd6',
            -- white  = '#c6cdd5',#c6cdd6"
            red    = '#ff5189',
            orange = '#ffa752',
            green  = '#7ce38b',
            grey   = '#89929b',
        }
        local bubbles_theme = {
            normal = {
                a = { fg = colors.black, bg = colors.green },
                -- a = { fg = colors.black, bg = colors.green },
                b = { fg = colors.grey, bg = colors.black2 },
                c = { fg = colors.grey, bg = colors.black2 },
                y = { fg = colors.grey, bg = colors.black2 },
            },
            insert = { a = { fg = colors.black, bg = colors.orange } },
            visual = { a = { fg = colors.black, bg = colors.cyan } },
            replace = { a = { fg = colors.black, bg = colors.red } },
            inactive = {
                a = { fg = colors.white, bg = colors.black },
                b = { fg = colors.white, bg = colors.black },
                -- c = { fg = 'none', bg = 'none' },
            },
        }
        local mode_map = {
            ["n"] = "h~",
            ["no"] = "OP",
            ["nov"] = "OP",
            ["noV"] = "OP",
            ["no\22"] = "OP",
            ["niI"] = "NI",
            ["niR"] = "NR",
            ["niV"] = "N ",
            ["nt"] = "NT",
            ["v"] = " V",
            ["vs"] = " V",
            ["V"] = "VL",
            ["Vs"] = "VL",
            ["\22"] = "VB",
            ["\22s"] = "VB",
            ["s"] = " S",
            ["S"] = "SL",
            ["\19"] = "SB",
            ["i"] = " I",
            ["ic"] = "IC",
            ["ix"] = "IX",
            ["R"] = " R",
            ["Rc"] = "RC",
            ["Rx"] = "RX",
            ["Rv"] = "VR",
            ["Rvc"] = "RVC",
            ["Rvx"] = "RVX",
            ["c"] = " C",
            ["cv"] = "EX",
            ["ce"] = "EX",
            ["r"] = " R",
            ["rm"] = " M",
            ["r?"] = " C",
            ["!"] = "SH",
            ["t"] = " T",
        }
        require('lualine').setup {
            options = {
                theme = bubbles_theme,
                disabled_filetypes = {
                    'NVimTree',
                    'Lazy'
                }
                -- component_separators = '|',
                -- component_separators = '',
                -- section_separators = { left = '', right = '' },
            },
            sections = {
                lualine_a = {
                    {
                        -- 'mode',
                        function()
                            return mode_map[vim.api.nvim_get_mode().mode] or "__"
                        end,
                        -- separator = { right = '' },
                        separator = { left = '', right = '' },
                        -- padding = { right = 2, left = 1 }
                    }
                },
                lualine_b = {
                    { 'fileformat', separator = '' },
                    {
                        'filetype',
                        icon_only = true,
                        -- separator = ''
                    },
                    {
                        'filename',
                        path = 3,
                        -- color = { fg = colors.green },
                        color = { fg = colors.white },
                        separator = { right = '' },
                        -- shorting_target = 40,
                    },
                    {
                        'searchcount',
                        separator = ''
                    }
                },
                lualine_c = {},
                lualine_x = {},
                lualine_y = {
                    {
                        'diff',
                        separator = { right = '', left = '' },
                        -- diff_color = {
                        --     added = { fg = 2 },
                        --     modified = { fg = 4 },
                        --     removed = { fg = 1 }
                        -- }
                    },
                    { 'branch' },
                    'progress'
                },
                lualine_z = {
                    {
                        'location',
                        separator = {
                            right = '',
                            left = ''
                        },
                        -- padding = { left = 2, right = 1 }
                        padding = { left = 0, right = 0 }
                    },
                    -- { 'location', separator = { left = '' }, padding = { left = 2, right = 1 } },
                },
            },
            -- inactive_sections = {
            --     lualine_b = {},
            --     lualine_c = {},
            --     lualine_x = {},
            --     lualine_y = {},
            --     -- lualine_z = { 'location' },
            -- },
            tabline = {},
            extensions = { 'fugitive' },
        }
    end
}
