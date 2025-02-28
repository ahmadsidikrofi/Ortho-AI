'use client';
import { useChat } from 'ai/react';
import RenderMessage from './RenderMessage';
import { CheckCircle, ClipboardText, PencilLine, Sparkle } from '@phosphor-icons/react';
import { useState, useRef } from 'react';
import UserMessageBox from './UserMessageBox';
import { Editor } from "@tinymce/tinymce-react"
import { marked } from 'marked';
import { Button } from "@/components/ui/button"
import { ArrowUp } from 'lucide-react';
import Header from './Header';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [ editResponseMode, setEditResponseMode ] = useState(null)
  const [ editContent, setEditContent ] = useState('')
  const [ isEditModeOn, setEditModeOn ] = useState(false)
  const [ isResponseCopied, setIsResponseCopied ] = useState(false)
  const [ copyResponseByID, setCopyResponseById ] = useState(null)
  const editorRef = useRef(null)

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

  const convertMarkdownToHTML = (markdown) => {
    return marked(markdown)
  }
  
  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto stretch border rounded-xl my-8 p-4">
      <Header />
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center mt-20">
          <Sparkle size={50} className="text-blue-500 mb-4" />
          <p className="text-2xl font-semibold text-gray-700">How can I assist you today?</p>
          <p className="text-sm text-gray-500">Ask me anything about dental care, treatments, or patient cases.</p>
        </div>
      ) : (
        <>
          {messages.map(m => {
            console.log(m.content)
            return (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} items-start max-sm:px-5 sm:px-5 lg:px-0`}>
                {m.role === 'assistant' && (
                  <span className='mt-4 mx-4'><Sparkle size={40} className='rounded-full border p-2' /></span>
                )}
                <div className="flex flex-col gap-2 max-w-[80%]">
                  <div className={`mt-4 p-3 ${isEditModeOn && editResponseMode === m.id ? '' : m.role === 'user' ? 'bg-[#00b0f0] text-white' : 'bg-blue-100 text-slate-800'} font-semibold rounded-[16px] overflow-x-auto ${isEditModeOn && m.role === 'assistant' ? '' : 'shadow-component'}`}>
                    {isEditModeOn && editResponseMode === m.id ? (
                      <Editor
                        apiKey='o61nnuwogclhd3z601n2k0zh479m9kbnsivauhaxrlu4jco0'
                        onInit={(_evt, editor) => editorRef.current = editor}
                        initialValue={convertMarkdownToHTML(editContent)}
                        init={{
                          height: 500,
                          width: 500,
                          menubar: false,
                          plugins: [
                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                          ],
                          toolbar: 'undo redo | blocks | ' +
                            'bold italic forecolor | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent | ' +
                            'removeformat | help',
                          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px, border:none }'
                        }}
                      />
                    ) : (
                      <div>
                        <RenderMessage content={m.content}/>
                        {/* {m.content} */}
                      </div>
                    )}
                  </div>
                  {m.role === 'assistant' && (
                    <div className='flex'>
                      <button className='mx-1 w-10' onClick={() => onEditResponseMode(m.id, m.content)}><PencilLine className='rounded-full p-2 hover:bg-gray-200' size={34} /></button>
                      <button className='mx-1 w-10' onClick={() => copyToClipboard(m.id, m.content)}>{isResponseCopied && copyResponseByID === m.id ? 
                        <CheckCircle className='rounded-full p-2 hover:bg-gray-200' size={34} /> 
                        : 
                        <ClipboardText className='rounded-full p-2 hover:bg-gray-200' size={34} />}
                      </button>
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
              <ArrowUp className='dark:text-black text-white hover:text-secondary-foreground scale-x-110' />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}