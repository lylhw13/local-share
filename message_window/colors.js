const COLORS = ["red", "pink", "purple", "deep-purple", "indigo", "blue", "light-blue", "cyan", "teal", "green", "light-green", "lime", "yellow", "amber",
                "orange", "deep-orange", "brown"]

export function pickcolor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
}