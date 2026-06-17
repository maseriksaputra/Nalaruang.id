import React, { useRef, useEffect } from 'react';
import useCanvasStore from '../../stores/useCanvasStore';

const IframePreview = ({ htmlContent, style }) => {
    const iframeRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            if (iframeRef.current && iframeRef.current.contentWindow) {
                try {
                    const body = iframeRef.current.contentWindow.document.body;
                    const html = iframeRef.current.contentWindow.document.documentElement;
                    if (body && html) {
                        const height = Math.max(
                            body.scrollHeight,
                            body.offsetHeight,
                            html.clientHeight,
                            html.scrollHeight,
                            html.offsetHeight
                        );
                        // Prevent shrinking back to 0 if content is initially small
                        if (height > 50) {
                            iframeRef.current.style.height = `${height}px`;
                        }
                    }
                } catch (e) {
                    console.error("Iframe resize error:", e);
                }
            }
        };

        // Resize when content loads
        const iframe = iframeRef.current;
        if (iframe) {
            iframe.addEventListener('load', handleResize);
            
            // Re-check periodically for dynamic content (like AOS animations)
            const interval = setInterval(handleResize, 1000);
            
            return () => {
                iframe.removeEventListener('load', handleResize);
                clearInterval(interval);
            };
        }
    }, [htmlContent]);

    useEffect(() => {
        const handleMessage = (e) => {
            if (e.data && e.data.type === 'INLINE_HTML_UPDATE') {
                useCanvasStore.getState().updateGlobalSettings({ custom_code: e.data.html });
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    if (!htmlContent) return null;

    // Inject editor script if in builder mode
    const isBuilder = window.location.pathname.includes('/builder/');
    let finalHtml = htmlContent;
    
    if (isBuilder) {
        const editorScript = `
        <script id="builder-inline-editor">
            (function() {
                if (window.__EDITOR_INJECTED__) return;
                window.__EDITOR_INJECTED__ = true;
                
                // Allow a tiny delay for frameworks to render
                setTimeout(() => {
                    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button, label, b, i, strong, em');
                    textElements.forEach(el => {
                        // Skip if it contains block elements to avoid messing up layouts
                        const hasBlocks = el.querySelector('div, section, article, ul, ol, form, iframe');
                        if (!hasBlocks) {
                            el.setAttribute('contenteditable', 'true');
                            
                            el.addEventListener('focus', function(e) {
                                e.stopPropagation();
                                this.dataset.original = this.innerHTML;
                                this.style.outline = '2px dashed #4f46e5';
                                this.style.outlineOffset = '2px';
                            });
                            
                            el.addEventListener('blur', function() {
                                this.style.outline = '';
                                if (this.dataset.original !== this.innerHTML) {
                                    const clone = document.documentElement.cloneNode(true);
                                    const script = clone.querySelector('#builder-inline-editor');
                                    if (script) script.remove();
                                    
                                    const editables = clone.querySelectorAll('[contenteditable]');
                                    editables.forEach(e => {
                                        e.removeAttribute('contenteditable');
                                        e.style.outline = '';
                                        e.style.outlineOffset = '';
                                        if (e.getAttribute('style') === '') e.removeAttribute('style');
                                        delete e.dataset.original;
                                    });
                                    
                                    window.parent.postMessage({
                                        type: 'INLINE_HTML_UPDATE',
                                        html: '<!DOCTYPE html>\\n' + clone.outerHTML
                                    }, '*');
                                }
                            });
                            
                            // Prevent links from navigating when editing
                            el.addEventListener('click', function(e) {
                                if(this.tagName === 'A') e.preventDefault();
                            });
                        }
                    });
                }, 500);
            })();
        </script>
        `;
        
        // Append script before closing body tag, or just append to end
        if (finalHtml.includes('</body>')) {
            finalHtml = finalHtml.replace('</body>', editorScript + '</body>');
        } else {
            finalHtml += editorScript;
        }
    }

    return (
        <iframe
            ref={iframeRef}
            srcDoc={finalHtml}
            style={{ 
                width: '100%', 
                minHeight: '844px',
                border: 'none', 
                overflow: 'hidden',
                ...style 
            }}
            title="Custom Injected Code"
            scrolling="no"
        />
    );
};

export default IframePreview;
