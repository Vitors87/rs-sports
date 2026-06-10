export function Avatar({
  name,
  avatarUrl,
  size = 38,
  shadow,
}: {
  name: string;
  avatarUrl?: string | null;
  size?: number;
  shadow?: boolean;
}) {
  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={name}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          flexShrink: 0,
          display: 'block',
          boxShadow: shadow ? '0 4px 20px rgba(42,157,143,0.4)' : undefined,
        }}
      />
    );
  }

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${Math.round(size * 0.32)}px`,
        fontWeight: 800,
        flexShrink: 0,
        letterSpacing: '0.02em',
        boxShadow: shadow ? '0 4px 20px rgba(42,157,143,0.4)' : undefined,
      }}
    >
      {initials}
    </div>
  );
}
