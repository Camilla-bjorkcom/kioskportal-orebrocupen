import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'

const ScrolltoTopBtn = () => {
    const [position, setPosition] = useState(0)

    useEffect(() => {
        window.addEventListener('scroll', () => {
            setPosition(window.scrollY)
        })

        return () => {
            window.removeEventListener('scroll', () => {})
        }
    }, [])

    const scrollToTop = () => {
        window.scroll({ top: 0, behavior: 'smooth' })
    }

    return (
        <button
            className={`hover:bg-gray-100 fixed bottom-6 right-5 h-16 w-16 z-[999] text-lg border-none rounded-full bg-gray-200 transition ease-in-out duration-300 delay-100 ${position < 100 ? 'hidden' : ''}`}
            onClick={scrollToTop}
        >
            <ArrowUp className='place-self-center'/>
        </button>
    )
}

export default ScrolltoTopBtn