import PDFDocument from 'pdfkit'
import path from 'path'
import fs from 'fs'
import AppError from '../errorHelpers/AppError'

interface IInvoiceData {
  transactionId: string
  amount: number
  bookingDate: string
  userName: string
  tourTitle: string
  guestCount: number
  totalAmount: number
}

const generatePdf = async (invoiceData: IInvoiceData, logoPath?: string) => {
  try {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 })

      const buffers: Uint8Array[] = []
      doc.on('data', (chunk: Uint8Array) => buffers.push(chunk))
      doc.on('end', () => {
        resolve(Buffer.concat(buffers))
      })
      doc.on('error', (err) => reject(err))

      const defaultLogoPath = path.join(
        process.cwd(),
        'src',
        'assets',
        'logo.png'
      )
      const finalLogoPath = logoPath || defaultLogoPath

      if (fs.existsSync(finalLogoPath)) {
        doc.image(finalLogoPath, 50, 50, { width: 80 })
      }

      doc.fontSize(24).font('Helvetica-Bold').text('INVOICE', 350, 60)

      doc
        .fontSize(11)
        .font('Helvetica')
        .text('Tripnest', 350, 100)
        .text('123 Tour Street, Dhaka', 350, 115)
        .text('Bangladesh', 350, 130)
        .text('Email: info@tripnest.com', 350, 145)

      // Bill To Section
      doc.fontSize(11).font('Helvetica-Bold').text('BILL TO:', 50, 200)
      doc
        .fontSize(10)
        .font('Helvetica')
        .text(invoiceData.userName, 50, 220)
        .text('Booking Reference: #' + invoiceData.transactionId, 50, 235)

      // Invoice Details Table Header
      const tableTop = 280
      const col1 = 50
      const col2 = 200
      const col3 = 350
      const col4 = 480

      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('Invoice No:', col1, tableTop)
        .text('Issue Date:', col2, tableTop)
        .text('Total Amount:', col4, tableTop)

      doc
        .fontSize(9)
        .font('Helvetica')
        .text(invoiceData.transactionId, col1, tableTop + 20)
        .text(invoiceData.bookingDate, col2, tableTop + 20)
        .text(`BDT ${invoiceData.totalAmount}`, col4, tableTop + 20)

      // Items Table
      const itemsTop = 340
      const boxTop = itemsTop - 10
      //   const boxHeight = 200

      // Table header
      doc.rect(col1 - 5, boxTop, 510, 25).stroke()

      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('Description', col1, boxTop + 7)
        .text('Quantity', col2, boxTop + 7)
        .text('Unit Price', col3, boxTop + 7)
        .text('Amount', col4, boxTop + 7)

      // Table row
      doc.rect(col1 - 5, boxTop + 25, 510, 50).stroke()

      doc
        .fontSize(10)
        .font('Helvetica')
        .text(invoiceData.tourTitle, col1, boxTop + 33, { width: 130 })
        .text(invoiceData.guestCount.toString(), col2, boxTop + 33)
        .text(`BDT ${invoiceData.amount}`, col3, boxTop + 33)
        .text(`BDT ${invoiceData.totalAmount}`, col4, boxTop + 33)

      // Total
      const totalTop = boxTop + 80
      doc.rect(col1 - 5, totalTop, 510, 30).stroke()

      doc
        .fontSize(11)
        .font('Helvetica-Bold')
        .text('Total Amount (BDT):', col3 - 40, totalTop + 8)
        .text(`BDT ${invoiceData.totalAmount}`, col4, totalTop + 8)

      // Footer
      doc
        .fontSize(9)
        .font('Helvetica')
        .text('Thank you for your booking!', 50, 700, { align: 'center' })
        .text('For support, contact: support@tripnest.com', 50, 715, {
          align: 'center'
        })

      doc.end()
    })
  } catch (error) {
    console.log(error)
    throw new AppError(500, 'Error generating PDF')
  }
}

export { generatePdf, IInvoiceData }
