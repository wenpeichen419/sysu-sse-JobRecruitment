// src/utils/pdf.js
import html2pdf from 'html2pdf.js'

/**
 * 把某个 DOM 元素导出成 PDF Blob（不直接下载）
 * @param {HTMLElement} el - 要导出的根元素
 * @param {string} fileName - 生成的默认文件名
 * @returns {Promise<Blob>}
 */
export async function exportElementToPDF(el, fileName = 'resume.pdf') {
  const opt = {
    margin: [10, 10, 10, 10], // mm
    filename: fileName,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['css', 'legacy'] }
  }
  // 只拿 Blob，下载交由外层控制
  const worker = html2pdf().from(el).set(opt)
  const blob = await worker.outputPdf('blob')
  return blob
}
