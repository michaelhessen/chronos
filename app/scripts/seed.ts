
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  try {
    // Create test user (required for testing - credentials must remain hidden)
    const testEmail = 'john@doe.com'
    const testPassword = 'johndoe123'
    const hashedTestPassword = await bcrypt.hash(testPassword, 12)

    const testUser = await prisma.user.upsert({
      where: { email: testEmail },
      update: {},
      create: {
        email: testEmail,
        password: hashedTestPassword,
        firstName: 'John',
        lastName: 'Doe',
        name: 'John Doe',
        timezone: 'Europe/Stockholm',
      }
    })

    console.log('✅ Test user created')

    // Create some categories for the test user
    const workCategory = await prisma.category.upsert({
      where: {
        userId_name: {
          userId: testUser.id,
          name: 'Arbete'
        }
      },
      update: {},
      create: {
        name: 'Arbete',
        color: '#3b82f6',
        userId: testUser.id,
      }
    })

    const personalCategory = await prisma.category.upsert({
      where: {
        userId_name: {
          userId: testUser.id,
          name: 'Personligt'
        }
      },
      update: {},
      create: {
        name: 'Personligt',
        color: '#10b981',
        userId: testUser.id,
      }
    })

    const meetingCategory = await prisma.category.upsert({
      where: {
        userId_name: {
          userId: testUser.id,
          name: 'Möten'
        }
      },
      update: {},
      create: {
        name: 'Möten',
        color: '#8b5cf6',
        userId: testUser.id,
      }
    })

    console.log('✅ Categories created')

    // Create some sample events
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    // Today's events
    const morningMeeting = await prisma.event.create({
      data: {
        title: 'Teammöte - Planering',
        description: 'Veckoplanering och statusuppdateringar för teamet',
        startDate: new Date(today.getTime() + 9 * 60 * 60 * 1000), // 09:00
        endDate: new Date(today.getTime() + 10 * 60 * 60 * 1000), // 10:00
        location: 'Konferensrum A',
        color: '#3b82f6',
        userId: testUser.id,
        source: 'manual'
      }
    })

    const lunch = await prisma.event.create({
      data: {
        title: 'Lunch med klient',
        description: 'Diskussion om nytt projekt över lunch',
        startDate: new Date(today.getTime() + 12 * 60 * 60 * 1000), // 12:00
        endDate: new Date(today.getTime() + 13.5 * 60 * 60 * 1000), // 13:30
        location: 'Restaurang Central',
        color: '#10b981',
        userId: testUser.id,
        source: 'manual'
      }
    })

    const projectReview = await prisma.event.create({
      data: {
        title: 'Projektgenomgång Q4',
        description: 'Genomgång av projektresultat och planering för nästa kvartal',
        startDate: new Date(today.getTime() + 15 * 60 * 60 * 1000), // 15:00
        endDate: new Date(today.getTime() + 16 * 60 * 60 * 1000), // 16:00
        location: 'Zoom',
        color: '#8b5cf6',
        userId: testUser.id,
        source: 'manual'
      }
    })

    // Add categories to events
    await prisma.eventCategory.createMany({
      data: [
        { eventId: morningMeeting.id, categoryId: meetingCategory.id },
        { eventId: morningMeeting.id, categoryId: workCategory.id },
        { eventId: lunch.id, categoryId: workCategory.id },
        { eventId: projectReview.id, categoryId: meetingCategory.id },
        { eventId: projectReview.id, categoryId: workCategory.id },
      ]
    })

    // Tomorrow's events
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
    
    await prisma.event.create({
      data: {
        title: 'Läkarbesök',
        description: 'Årlig hälsokontroll',
        startDate: new Date(tomorrow.getTime() + 10 * 60 * 60 * 1000), // 10:00
        endDate: new Date(tomorrow.getTime() + 11 * 60 * 60 * 1000), // 11:00
        location: 'Vårdcentral Söder',
        color: '#f59e0b',
        userId: testUser.id,
        source: 'manual'
      }
    })

    await prisma.event.create({
      data: {
        title: 'Middag med familjen',
        description: 'Fredagsmiddag hemma',
        startDate: new Date(tomorrow.getTime() + 18 * 60 * 60 * 1000), // 18:00
        endDate: new Date(tomorrow.getTime() + 20 * 60 * 60 * 1000), // 20:00
        location: 'Hemma',
        color: '#10b981',
        userId: testUser.id,
        source: 'manual'
      }
    })

    // Next week's events
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    // Recurring pattern for weekly team meeting
    const weeklyMeetingPattern = await prisma.recurringPattern.create({
      data: {
        rrule: 'FREQ=WEEKLY;BYDAY=MO;INTERVAL=1',
        startDate: nextWeek,
        endDate: new Date(nextWeek.getTime() + 90 * 24 * 60 * 60 * 1000) // 3 months
      }
    })

    await prisma.event.create({
      data: {
        title: 'Veckomöte - Utveckling',
        description: 'Återkommande utvecklingsmöte varje måndag',
        startDate: new Date(nextWeek.getTime() + 9 * 60 * 60 * 1000), // 09:00
        endDate: new Date(nextWeek.getTime() + 10 * 60 * 60 * 1000), // 10:00
        location: 'Konferensrum B',
        color: '#3b82f6',
        isRecurring: true,
        recurringPatternId: weeklyMeetingPattern.id,
        userId: testUser.id,
        source: 'manual'
      }
    })

    // Some events spread throughout the month
    for (let i = 1; i <= 15; i++) {
      const eventDate = new Date(today.getTime() + i * 24 * 60 * 60 * 1000)
      const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444']
      const titles = [
        'Kundmöte',
        'Projektarbete',
        'Administrativa uppgifter',
        'Utveckling',
        'Planering',
        'Workshop',
        'Presentation',
        'Uppföljning'
      ]
      
      if (Math.random() > 0.6) { // 40% chance of event each day
        await prisma.event.create({
          data: {
            title: titles[Math.floor(Math.random() * titles.length)],
            description: 'Automatiskt genererad händelse för demonstration',
            startDate: new Date(eventDate.getTime() + (8 + Math.random() * 8) * 60 * 60 * 1000),
            endDate: new Date(eventDate.getTime() + (9 + Math.random() * 8) * 60 * 60 * 1000),
            color: colors[Math.floor(Math.random() * colors.length)],
            userId: testUser.id,
            source: 'manual'
          }
        })
      }
    }

    console.log('✅ Sample events created')

    // Create an import log entry
    await prisma.importExportLog.create({
      data: {
        type: 'import',
        filename: 'sample_calendar.ics',
        eventsCount: 5,
        success: true,
        userId: testUser.id,
      }
    })

    console.log('✅ Import log created')
    console.log('🎉 Database seeding completed successfully!')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
