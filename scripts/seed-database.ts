import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedDatabase() {
  try {
    console.log('🌱 Starte Datenbank-Seeding...')

    // Sequenznummern für das aktuelle Jahr initialisieren
    const currentYear = new Date().getFullYear()

    // Prüfen ob bereits Sequenznummern für das Jahr existieren
    const existingOrderSeq = await prisma.orderNumber.findFirst({
      where: { year: currentYear }
    })

    if (!existingOrderSeq) {
      await prisma.orderNumber.create({
        data: { year: currentYear, sequence: 0 }
      })
      console.log(`✅ Order-Sequenz für Jahr ${currentYear} initialisiert`)
    }

    const existingInvoiceSeq = await prisma.invoiceNumber.findFirst({
      where: { year: currentYear }
    })

    if (!existingInvoiceSeq) {
      await prisma.invoiceNumber.create({
        data: { year: currentYear, sequence: 0 }
      })
      console.log(`✅ Invoice-Sequenz für Jahr ${currentYear} initialisiert`)
    }

    console.log('🎉 Datenbank-Seeding erfolgreich abgeschlossen!')

  } catch (error) {
    console.error('❌ Fehler beim Seeding:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seedDatabase()
