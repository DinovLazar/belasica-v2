/**
 * Primary navigation — the single source for header and footer links.
 * Labels are design/nav strings (not content facts). Slugs are Latin
 * transliterations per D-0.00-4; target routes may 404 until built in
 * later phases.
 */
export const NAV_ITEMS = [
  { label: "Почетна", href: "/" },
  { label: "Архива", href: "/arhiva" },
  { label: "Легенди", href: "/legendi" },
  { label: "Статистика", href: "/statistika" },
  { label: "За нас", href: "/za-nas" },
  { label: "Контакт", href: "/kontakt" },
] as const;

export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
