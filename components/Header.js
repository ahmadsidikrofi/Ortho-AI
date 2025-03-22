import DarkModeToggle from "../components/DarkModeToggle"

const Header = () => {
    return (
        <div className='flex justify-between'>
            <div>
                <p className='text-3xl font-semibold'>Ortho-AI Assistant</p>
                <p className='text-sm text-neutral-500'>Your AI-powered orthodontic consultant</p>
            </div>
            <div>
                <DarkModeToggle />
            </div>
        </div>
    )
}

export default Header;