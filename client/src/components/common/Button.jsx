export default function Button({ children, variant = 'primary', size = 'md', disabled, onClick, type = 'button', className = '' }) {
  const classes = ['btn', `btn-${variant}`, `btn-${size}`, disabled ? 'btn-disabled' : '', className].filter(Boolean).join(' ');
  return <button type={type} className={classes} disabled={disabled} onClick={onClick}>{children}</button>;
}
