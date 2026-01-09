import Contact from '../components/Contact'

type FooterProps = {
  backgroundClassName?: string
  borderClassName?: string
  textClassName?: string
  mutedTextClassName?: string
}

export default function Footer({
  backgroundClassName = 'bg-white',
  borderClassName = 'border-gray-200',
  textClassName = 'text-slate-900',
  mutedTextClassName = 'text-gray-500',
}: FooterProps) {
  return (
    <footer className={`${backgroundClassName} ${borderClassName} ${textClassName} border-t mt-20 py-6`}>
      <Contact />
      <div className={`text-center max-w-6xl mx-auto px-4 text-sm flex flex-col md:flex-row justify-between ${mutedTextClassName}`}>
        <span>&copy;Awais Auto Repair & Tire Shop. All rights reserved. Brooklyn, NY</span>
      </div>
    </footer>
  )
}
