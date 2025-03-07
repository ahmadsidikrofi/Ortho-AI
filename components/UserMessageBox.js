import { ArrowUp, Loader2 } from "lucide-react";
import { Button } from "./ui/button";

const UserMessageBox = ({ setEditContent, input, handleInputChange, handleSubmit, isLoading }) => {
    let isComposing = false // Flag untuk deteksi IME
    const handleCompositionStart = () => { isComposing = true }
    const handleCompositionEnd = () => { isComposing = false }
    
    const handleKeyPress = (e) => {
        const isMobileDevice = window.innerWidth <= 768
        if (isComposing) return
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault()
            handleSubmit()
        } else if (e.key === 'Enter' && e.shiftKey) {
            const cursorPosition = e.target.selectionStart;
            const updatedValue =
                input.slice(0, cursorPosition) + "\n" + input.slice(cursorPosition);
            handleInputChange({ target: { value: updatedValue } })
            setEditContent(e.target.value)
            e.target.scrollTop = e.target.scrollHeight
            e.preventDefault();
        } else if (isMobileDevice && e.key === "Enter") {
            const cursorPosition = e.target.selectionStart;
            const updatedValue =
                input.slice(0, cursorPosition) + "\n" + input.slice(cursorPosition);
            handleInputChange({ target: { value: updatedValue } })
            setEditContent(e.target.value)
            e.target.scrollTop = e.target.scrollHeight
            e.preventDefault();
        }
        // else if (!isMobileDevice && e.key === 'Enter' && !e.shiftKey) {
        //     e.preventDefault();
        //     handleSubmit();
        // }
    }

    return (
        <div className="dark:bg-black/40 bg-slate-100/40 backdrop-blur-md p-2 rounded-[15px] ">
            <div className="relative flex w-full">
                <textarea
                    className="flex-1 dark:text-white text-slate-800 pt-3 px-5 pr-14 rounded-[15px] shadow-[0_4px_12px_rgba(0,0,0,0.2)] mx-auto focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-white  placeholder:text-slate-800 dark:placeholder:text-stone-200 dark:caret-white caret-black resize-none scrollbar-hide transition-all duration-300"
                    value={input}
                    placeholder="Ask me a question"
                    onChange={(e) => {
                        handleInputChange(e)
                        const lines = e.target.value.split(/\r\n|\r|\n/).length
                        e.target.style.height = `${Math.min(100 + (lines - 1) * 24, 100 + 4 * 24)}px`
                    }}
                    onKeyDown={(e) => handleKeyPress(e)}
                    onCompositionStart={handleCompositionStart}
                    onCompositionEnd={handleCompositionEnd}
                    style={{
                        height: `${Math.min(100 + (input.split(/\r\n|\r|\n/).length - 1) * 24, 100 + 4 * 24)}px`,
                        lineHeight: '24px',
                    }}
                >
                </textarea>
                <Button onClick={handleSubmit} variant="outline" size="icon" className="absolute right-3 bottom-4 rounded-[10px] dark:bg-white bg-black dark:hover:bg-gray-200 hover:bg-gray-700 p-4">
                    {isLoading ? (
                        <Loader2 className="animate-spin text-white dark:text-black" />
                    ) : (
                        <ArrowUp className='dark:text-black text-white hover:text-secondary-foreground scale-x-110' />
                    )}
                </Button>
            </div>
            <footer className="mt-2 mb-2 flex justify-center">
                <p className="text-[13px] text-stone-700">Ortho-AI can make mistakes, so double check your responses.</p>
            </footer>
        </div>
    )
}
export default UserMessageBox