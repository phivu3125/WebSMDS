import { Request, Response } from 'express'
import { compare } from 'bcryptjs'
import { prisma } from '../lib/prisma'
import { AuthRequest } from '../middleware/auth'

const EVENT_REGISTRATION_STATUSES = ['unread', 'read']

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const { status } = req.query

    const where: any = {}
    if (status && typeof status === 'string') {
      where.status = status
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    res.json(events)
  } catch (error) {
    console.error('Get events error:', error)
    res.status(500).json({ error: 'Failed to fetch events' })
  }
}

export const createEventRegistration = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params
    const { fullName, email, phone, note } = req.body ?? {}

    if (!slug) {
      return res.status(400).json({ error: 'Slug is required' })
    }

    if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
      return res.status(400).json({ error: 'Họ và tên là bắt buộc' })
    }

    if (!phone || typeof phone !== 'string' || !phone.trim()) {
      return res.status(400).json({ error: 'Số điện thoại là bắt buộc' })
    }

    const event = await prisma.event.findUnique({
      where: { slug },
      select: { id: true, status: true },
    })

    if (!event || event.status !== 'published') {
      return res.status(404).json({ error: 'Sự kiện không tồn tại hoặc chưa được xuất bản' })
    }

    const registration = await prisma.eventRegistration.create({
      data: {
        eventId: event.id,
        fullName: fullName.trim(),
        email: email && typeof email === 'string' ? email.trim() : null,
        phone: phone.trim(),
        note: note && typeof note === 'string' ? note.trim() : null,
        status: 'unread',
      },
    })

    res.status(201).json({ message: 'Đăng ký thành công', data: registration })
  } catch (error) {
    console.error('Create event registration error:', error)
    res.status(500).json({ error: 'Không thể đăng ký tham gia sự kiện' })
  }
}

export const getEventRegistrationsAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const { eventId } = req.query as { eventId?: string }

    const where: any = {}
    if (eventId && typeof eventId === 'string') {
      where.eventId = eventId
    }

    const registrations = await prisma.eventRegistration.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        event: { select: { id: true, title: true, slug: true } },
      },
    })

    res.json(registrations)
  } catch (error) {
    console.error('Get event registrations admin error:', error)
    res.status(500).json({ error: 'Không thể tải danh sách đăng ký' })
  }
}

export const checkEventSlug = async (req: Request, res: Response) => {
  try {
    const { slug, excludeId } = req.query;

    if (!slug || typeof slug !== 'string') {
      return res.status(400).json({ error: 'Slug is required' });
    }

    const sanitizedSlug = slug.trim().toLowerCase();

    const existing = await prisma.event.findFirst({
      where: {
        slug: sanitizedSlug,
        ...(excludeId && typeof excludeId === 'string'
          ? { NOT: { id: excludeId } }
          : {}),
      },
      select: { id: true },
    });

    res.json({ exists: Boolean(existing) });
  } catch (error) {
    console.error('Error checking event slug:', error);
    res.status(500).json({ error: 'Failed to check slug' });
  }
}

export const updateEventRegistrationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { status } = req.body as { status?: string }

    if (!id) {
      return res.status(400).json({ error: 'ID là bắt buộc' })
    }

    if (!status || typeof status !== 'string' || !EVENT_REGISTRATION_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Trạng thái không hợp lệ' })
    }

    const data: { status: string; readAt?: Date | null } = { status }
    data.readAt = status === 'read' ? new Date() : null

    const registration = await prisma.eventRegistration.update({
      where: { id },
      data,
    })

    res.json(registration)
  } catch (error) {
    console.error('Update event registration status error:', error)
    res.status(500).json({ error: 'Không thể cập nhật trạng thái' })
  }
}

export const deleteEventRegistration = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ error: 'ID là bắt buộc' })
    }

    await prisma.eventRegistration.delete({
      where: { id },
    })

    res.json({ message: 'Đã xóa đăng ký thành công' })
  } catch (error) {
    console.error('Delete event registration error:', error)
    res.status(500).json({ error: 'Không thể xóa đăng ký' })
  }
}

export const getEventBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params
    const event = await prisma.event.findUnique({
      where: { slug },
    })

    if (!event || event.status !== 'published') {
      return res.status(404).json({ error: 'Event not found' })
    }

    res.json(event)
  } catch (error) {
    console.error('Get event error:', error)
    res.status(500).json({ error: 'Failed to fetch event' })
  }
}

export const getEventByIdAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const event = await prisma.event.findUnique({
      where: { id },
    })

    if (!event) {
      return res.status(404).json({ error: 'Event not found' })
    }

    res.json(event)
  } catch (error) {
    console.error('Get event error:', error)
    res.status(500).json({ error: 'Failed to fetch event' })
  }
}

export const createEvent = async (req: Request, res: Response) => {
  try {
    const body = req.body ?? {}
    const eventData = { ...body }

    // Validate required fields
    if (!eventData.title?.trim()) {
      return res.status(400).json({ error: 'Title is required' })
    }

    if (!eventData.description?.trim()) {
      return res.status(400).json({ error: 'Description is required' })
    }

    if (!eventData.slug?.trim()) {
      return res.status(400).json({ error: 'Slug is required' })
    }

    // Handle subtitle (optional field - trim if provided)
    if (eventData.subtitle && typeof eventData.subtitle === 'string') {
      eventData.subtitle = eventData.subtitle.trim()
    }

    // Handle eventIntro and eventDetails (optional fields - trim if provided)
    if (eventData.eventIntro && typeof eventData.eventIntro === 'string') {
      eventData.eventIntro = eventData.eventIntro.trim()
    }

    if (eventData.eventDetails && typeof eventData.eventDetails === 'string') {
      eventData.eventDetails = eventData.eventDetails.trim()
    }

    const event = await prisma.event.create({
      data: {
        title: eventData.title,
        subtitle: eventData.subtitle,
        slug: eventData.slug,
        description: eventData.description,
        eventIntro: eventData.eventIntro,
        eventDetails: eventData.eventDetails,
        image: eventData.image,
        location: eventData.location,
        openingHours: eventData.openingHours,
        dateDisplay: eventData.dateDisplay,
        venueMap: eventData.venueMap,
        pricingImage: eventData.pricingImage,
        status: eventData.status || 'draft',
      },
    })

    res.status(201).json(event)
  } catch (error) {
    console.error('Create event error:', error)
    res.status(500).json({ error: 'Failed to create event' })
  }
}

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const body = req.body ?? {}
    const eventData: Record<string, any> = { ...body }
    delete eventData.id

    // Validate required fields if provided
    if (eventData.title !== undefined && !eventData.title?.trim()) {
      return res.status(400).json({ error: 'Title is required' })
    }

    if (eventData.description !== undefined && !eventData.description?.trim()) {
      return res.status(400).json({ error: 'Description is required' })
    }

    if (eventData.slug !== undefined && !eventData.slug?.trim()) {
      return res.status(400).json({ error: 'Slug is required' })
    }

    // Handle subtitle (optional field - trim if provided)
    if (eventData.subtitle && typeof eventData.subtitle === 'string') {
      eventData.subtitle = eventData.subtitle.trim()
    }

    // Handle eventIntro and eventDetails (optional fields - trim if provided)
    if (eventData.eventIntro && typeof eventData.eventIntro === 'string') {
      eventData.eventIntro = eventData.eventIntro.trim()
    }

    if (eventData.eventDetails && typeof eventData.eventDetails === 'string') {
      eventData.eventDetails = eventData.eventDetails.trim()
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title: eventData.title,
        subtitle: eventData.subtitle,
        slug: eventData.slug,
        description: eventData.description,
        eventIntro: eventData.eventIntro,
        eventDetails: eventData.eventDetails,
        image: eventData.image,
        location: eventData.location,
        openingHours: eventData.openingHours,
        dateDisplay: eventData.dateDisplay,
        venueMap: eventData.venueMap,
        pricingImage: eventData.pricingImage,
        status: eventData.status,
      },
    })

    res.json(updatedEvent)
  } catch (error) {
    console.error('Update event error:', error)
    res.status(500).json({ error: 'Failed to update event' })
  }
}

export const updateEventStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (typeof status !== 'string' || !status.trim()) {
      return res.status(400).json({ error: 'Status is required' })
    }

    const normalizedStatus = status.trim()
    const allowedStatuses = ['draft', 'published', 'ongoing', 'ended']

    if (!allowedStatuses.includes(normalizedStatus)) {
      return res.status(400).json({ error: 'Invalid status value' })
    }

    const event = await prisma.event.update({
      where: { id },
      data: { status: normalizedStatus }
    })

    res.json(event)
  } catch (error) {
    console.error('Update event status error:', error)
    res.status(500).json({ error: 'Failed to update event status' })
  }
}

export const deleteEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { password } = req.body as { password?: string }

    if (!password) {
      return res.status(400).json({ error: 'Vui lòng nhập mật khẩu' })
    }

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { password: true }
    })

    if (!user?.password) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(403).json({ error: 'Mật khẩu không đúng' })
    }

    await prisma.event.delete({
      where: { id }
    })

    res.json({ message: 'Event deleted successfully' })
  } catch (error) {
    console.error('Delete event error:', error)
    res.status(500).json({ error: 'Failed to delete event' })
  }
}