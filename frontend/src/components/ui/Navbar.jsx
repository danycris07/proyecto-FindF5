import CardNav from "./CardNav.jsx";

const NAV_ITEMS = [
  {
    label: "Cómo funciona",
    bgColor: "var(--surface)",
    textColor: "var(--text-primary)",
    links: [
      {
        label: "Ver los pasos",
        ariaLabel: "Ir a cómo funciona",
        href: "#como-funciona",
      },
    ],
  },
  {
    label: "Canchas",
    bgColor: "var(--surface)",
    textColor: "var(--text-primary)",
    links: [
      {
        label: "Explorar canchas",
        ariaLabel: "Ir a canchas",
        href: "#canchas",
      },
    ],
  },
  {
    label: "Historias de usuarios",
    bgColor: "var(--surface)",
    textColor: "var(--text-primary)",
    links: [
      {
        label: "Ver historias",
        ariaLabel: "Ir a Historias de usuarios",
        href: "#historias-de-usuarios",
      },
    ],
  },
];

function Navbar() {
  return (
    <header className="sticky top-0 z-30 h-24 border-b border-transparent bg-transparent">
      <CardNav items={NAV_ITEMS} />
    </header>
  );
}

export default Navbar;
