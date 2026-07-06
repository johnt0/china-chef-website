export interface NavItem {
    route: string,
    label: string,
}

export const navItems: NavItem[] = [
    { route: '#menu', label: 'Menu' },
    { route: '#story', label: 'Story' },
    { route: '#visit', label: 'Visit' },
]