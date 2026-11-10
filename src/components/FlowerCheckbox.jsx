// Checkbox em formato de flor: só o contorno dourado; ao marcar, a flor fica preenchida e "desabrocha".
export default function FlowerCheckbox({ id, label, align = 'center', ...props }) {
  return (
    <div className={`flex gap-2.5 ${align === 'start' ? 'items-start' : 'items-center'}`}>
      <input id={id} type="checkbox" className="au-check focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold-ui" {...props} />
      <label htmlFor={id} className="text-sm leading-[1.45] text-surface/85">
        {label}
      </label>
    </div>
  )
}
