'use client';
import { useChat } from 'ai/react';
import RenderMessage from './RenderMessage';
import { CheckCircle, ClipboardText, PencilLine, Sparkle } from '@phosphor-icons/react';
import { useState, useRef, useEffect } from 'react';
import UserMessageBox from './UserMessageBox';
import { Button } from "@/components/ui/button"
import { ArrowUp, Loader2 } from 'lucide-react';
import Header from './Header';
import { TextShimmer } from './ui/text-shimmer';
import EditorChat from './EditorChat';
import { TextEffect } from './ui/text-effect';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  const [ editResponseMode, setEditResponseMode ] = useState(null)
  const [ editContent, setEditContent ] = useState('')
  const [ isEditModeOn, setEditModeOn ] = useState(false)
  const [ isResponseCopied, setIsResponseCopied ] = useState(false)
  const [ copyResponseByID, setCopyResponseById ] = useState(null)

  const onEditResponseMode = (messageId, content) => {
    setEditModeOn((prevState) => !prevState)
    setEditResponseMode(messageId)
    setEditContent(content)
  }
  const copyToClipboard = async (messageId, text) => {
    const formattedText = formatMarkdownForCopy(text);
    navigator.clipboard.writeText(formattedText).then(() => {
      setCopyResponseById(messageId);
      setIsResponseCopied(true);
      setTimeout(() => setIsResponseCopied(false), 1000)
    })
  }
  const formatMarkdownForCopy = (text) => {
    return text
      .replace(/\**\*/g, "")
      .replace(/\|-/g, "")
      .replace(/\|/g, "\t")
      .replace(/\n\s*\n/g, "\n")
      .replace(/\n\s*-{3,}\s*\n/g, "\n")
  }
  
  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto stretch border rounded-xl my-8 p-4">
      <Header />
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center mt-20">
          <Sparkle size={60} className="text-blue-500 mb-4" />
          <TextEffect per='word' as='h3' preset='blur' className="text-3xl text-gray-700">
            How can I assist you today?
          </TextEffect>
          <TextEffect per='word' as='h3' preset='slide' className="text-sm text-gray-500">
            Ask me anything about dental care, treatments, or patient cases.
          </TextEffect>
        </div>
      ) : (
        <>
          {messages.map((m, index) => {
            const isLastMessage = index === messages.length - 1;
            const isAssistantMessage = m.role === 'assistant';
            // console.log(m.content)
            return (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} items-start max-sm:px-5 sm:px-5 lg:px-0`}>
                {isAssistantMessage && (
                  <span className='mt-4 mx-4'><Sparkle size={40} className='rounded-full border p-2' /></span>
                )}
                <div className="flex flex-col gap-2 max-w-[80%]">
                  <div className={`mt-4 p-3 ${isEditModeOn && editResponseMode === m.id ? '' : m.role === 'user' ? 'bg-[#00b0f0] text-white' : 'bg-blue-100 text-slate-800'} rounded-[16px] overflow-x-auto ${isEditModeOn && m.role === 'assistant' ? '' : 'shadow-component'}`}>
                    {isEditModeOn && editResponseMode === m.id ? (
                      <EditorChat editContent={editContent}/>
                    ) : (
                      <div>
                          {isAssistantMessage && isLastMessage && isLoading && (
                            <TextShimmer className="text-sm my-4" duration={1}>
                              Generating Answer...
                            </TextShimmer>
                          )}
                        <RenderMessage content={m.content} animate={m.role === 'assistant' && index === messages.length - 1} />
                      </div>
                    )}
                  </div>
                  {m.role === 'assistant' && (
                    <div className='flex'>
                      <Button variant='ghost' className='mx-1' onClick={() => onEditResponseMode(m.id, m.content)}>
                        <PencilLine /> Edit
                      </Button>
                      <Button variant='ghost' onClick={() => copyToClipboard(m.id, m.content)}>{isResponseCopied && copyResponseByID === m.id ? 
                        <CheckCircle/>
                        : 
                        <><ClipboardText /> Salin</>}
                      </Button>
                    </div>
                  )}
                  {isEditModeOn && editResponseMode === m.id && (
                    <div className='flex gap-4'>
                      <button onClick={() => setEditModeOn(false)} className='bg-black text-white rounded-[30px] w-24 p-1'>Cancel</button>
                      <button className='bg-black text-white rounded-[30px] w-24 p-1'>Send</button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </>
      )}

      <div className='mt-20'>    
        <form onSubmit={handleSubmit} className='fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-xl'>
          <div className='flex gap-4 items-center justify-center max-sm:px-5'>
            <UserMessageBox setEditContent={setEditContent} input={input} handleInputChange={handleInputChange} handleSubmit={handleSubmit}/>
            <Button onClick={handleSubmit} variant="outline" size="icon" className="rounded-[10px] dark:bg-white bg-black dark:hover:bg-gray-200 hover:bg-gray-700 p-4">
              {isLoading ? (
                <Loader2 className="animate-spin text-white dark:text-black" />
              ) : (
                <ArrowUp className='dark:text-black text-white hover:text-secondary-foreground scale-x-110' />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}