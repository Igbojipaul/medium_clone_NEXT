'use client';

import { useEffect, useRef, forwardRef, useState } from 'react';
import 'quill/dist/quill.snow.css';

const RichTextEditor = forwardRef(({ value, onChange, placeholder = 'Write something...' }, ref) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const initialValueSetRef = useRef(false);
  const onChangeRef = useRef(onChange);

  // Always keep the onChange ref updated
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    setIsClient(true);
    
    if (isClient && editorRef.current && !quillRef.current) {
      import('quill').then(Quill => {
        // Only initialize Quill once
        if (quillRef.current) return;
        
        const quill = new Quill.default(editorRef.current, {
          theme: 'snow',
          modules: {
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link', 'image'],
              ['clean'],
            ],
          },
          placeholder,
        });

        quillRef.current = quill;
        
        // Set initial value only once
        if (value && !initialValueSetRef.current) {
          quill.root.innerHTML = value;
          initialValueSetRef.current = true;
        }
        
        // Handle content changes
        quill.on('text-change', () => {
          const content = quill.root.innerHTML;
          onChangeRef.current && onChangeRef.current(content);
        });
      });
    }
    
    return () => {
      // Don't destroy Quill instance on re-renders
      // Only clean up when component unmounts
    };
  }, [isClient]); // Only isClient as dependency

  if (!isClient) {
    return (
      <div className="border border-gray-200 rounded-xl bg-white" style={{ height: '400px' }}>
        <div className="flex items-center justify-center h-full text-gray-500">
          Loading editor...
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
      <div ref={editorRef} style={{ height: '400px' }} />
    </div>
  );
});

RichTextEditor.displayName = 'RichTextEditor';
export default RichTextEditor;