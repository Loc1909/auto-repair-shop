export default function BrandBadge({ brand }) {
    const colors = {
        Toyota: "#EB0A1E", Honda: "#CC0000", Ford: "#003476", Suzuki: "#0033A0",
        Hyundai: "#002C5F", Kia: "#05141F", Mazda: "#910000", Mitsubishi: "#E60012",
    };
    const bg = colors[brand?.trim()] || "#FF6B2B";
    return (
        <span className="brand-badge" style={{ background: bg }}>
            {brand?.[0] ?? "?"}
        </span>
    );
}