export function IconBadge({ icon: Icon, size = 34 }) {
  const iconSize = Math.round(size * 0.52)

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-[10px] bg-orange-tint text-orange-dark"
      style={{ width: size, height: size }}
    >
      <Icon size={iconSize} strokeWidth={2.1} />
    </div>
  )
}
