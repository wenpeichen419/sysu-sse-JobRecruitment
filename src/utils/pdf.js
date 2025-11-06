// src/utils/pdf.js
import html2pdf from 'html2pdf.js'

/**
 * 把某个 DOM 元素导出成 PDF Blob（不直接下载）
 * @param {HTMLElement} el - 要导出的根元素（宽度建议 794px @96dpi）
 * @param {string} fileName - 生成的默认文件名（仅用于元信息）
 * @returns {Promise<Blob>}
 */
export async function exportElementToPDF(el, fileName = 'resume.pdf') {
  // 等待内部图片与自定义字体加载完
  const imgs = Array.from(el.querySelectorAll('img'))
  await Promise.all(
    imgs.map(img => (img.complete ? null : new Promise(r => { img.onload = img.onerror = r })))
  )

  const opt = {
    margin:       [0, 0, 6, 0],           // mm，和示例版式一致
    filename:     fileName,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, windowWidth: 794, windowHeight: 1123 },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak:    { mode: ['css', 'legacy'] }  // 尊重 CSS 分页
  }

  // 只拿 Blob，下载和持久化由外层控制
  const worker = html2pdf().set(opt).from(el)
  const blob = await worker.outputPdf('blob')
  return blob
}
