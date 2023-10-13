local wezterm = require 'wezterm'
local act = wezterm.action

local config = {}

if wezterm.config_builder then
    config = wezterm.config_builder()
end

config.default_prog = { 'bash' }

config.color_scheme = 'Glacier'
config.window_decorations = 'RESIZE'
config.font = wezterm.font 'JetBrainsMono Nerd Font Mono'
config.hide_tab_bar_if_only_one_tab = true
config.window_background_opacity = 0.93
config.colors = {
    background = '#1c2128',
    selection_fg = '#1c2128',
    selection_bg = '#7ce38b',
    cursor_bg = '#7ce38b',
    cursor_border = '#7ce38b',
    cursor_fg = '#1c2128',
}

config.disable_default_key_bindings = true
config.keys = {
    -- fix for ctrl+space not sending properly.  windows terminal has an identical issue
    {
        key = ' ',
        mods = 'CTRL',
        action = act.SendKey {
            key = ' ',
            mods = 'CTRL',
        },
    },
    -- ctrl + v doesnt seem to work ..
    -- {
    --     key = 'V',
    --     mods = 'CTRL',
    --     action = act.PasteFrom 'Clipboard'
    -- },
    -- {
    --     key = 'V',
    --     mods = 'CTRL',
    --     action = act.PasteFrom 'PrimarySelection'
    -- },
    {
        key = '-',
        mods = 'CTRL',
        action = wezterm.action.DecreaseFontSize
    },
    {
        key = '=',
        mods = 'CTRL',
        action = wezterm.action.IncreaseFontSize
    },
    {
        key = '0',
        mods = 'CTRL',
        action = wezterm.action.ResetFontAndWindowSize,
    },
    -- copy
    {
        key = 'C',
        mods = 'CTRL',
        action = wezterm.action.CopyTo 'ClipboardAndPrimarySelection',
    },
}

config.mouse_bindings = {
    -- paste
    {
        event = { Down = { streak = 1, button = "Right" } },
        mods = "NONE",
        action = act({ PasteFrom = "Clipboard" }),
    },
}

return config
