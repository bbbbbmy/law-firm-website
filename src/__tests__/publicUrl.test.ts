import { publicUrl } from '@/lib/publicUrl'

describe('publicUrl', () => {
  describe('absolute url passthrough', () => {
    it('returns https:// other.com unchanged', () => {
      expect(publicUrl('https://example.com', 'https://other.com/x.jpg'))
        .toBe('https://other.com/x.jpg')
    })
    it('returns http:// other.com unchanged', () => {
      expect(publicUrl('https://example.com', 'http://other.com/x.jpg'))
        .toBe('http://other.com/x.jpg')
    })
    it('absolute url ignores baseUrl with trailing slash', () => {
      expect(publicUrl('https://example.com/', 'https://other.com/x.jpg'))
        .toBe('https://other.com/x.jpg')
    })
  })

  describe('relative path concat', () => {
    it('joins root-relative path with bare origin', () => {
      expect(publicUrl('https://example.com', '/uploads/foo.jpg'))
        .toBe('https://example.com/uploads/foo.jpg')
    })
    it('joins root-relative path with trailing-slash origin', () => {
      expect(publicUrl('https://example.com/', '/uploads/foo.jpg'))
        .toBe('https://example.com/uploads/foo.jpg')
    })
    it('joins root-relative path with multi trailing slashes', () => {
      expect(publicUrl('https://example.com///', '/uploads/foo.jpg'))
        .toBe('https://example.com/uploads/foo.jpg')
    })
    it('joins path without leading slash (no double slash)', () => {
      expect(publicUrl('https://example.com', 'uploads/foo.jpg'))
        .toBe('https://example.com/uploads/foo.jpg')
    })
  })

  describe('basePath handling (publicUrl does NOT strip basePath from url)', () => {
    // publicUrl treats url as opaque; it does not look for /lawfirm in it.
    // Caller's responsibility: do NOT also append /lawfirm to baseUrl.
    it('does NOT strip basePath from url; caller should keep baseUrl clean', () => {
      // Unsafe: baseUrl ends with /lawfirm AND url starts with /lawfirm.
      // publicUrl does not "fix" this — it concatenates, producing /lawfirm/lawfirm/...
      // The caller must not configure NEXT_PUBLIC_SITE_URL with a trailing /lawfirm.
      expect(publicUrl('https://example.com/lawfirm', '/lawfirm/uploads/media/x.jpg'))
        .toBe('https://example.com/lawfirm/lawfirm/uploads/media/x.jpg')
    })
    it('joins when only baseUrl has basePath', () => {
      expect(publicUrl('https://example.com/lawfirm', '/uploads/media/x.jpg'))
        .toBe('https://example.com/lawfirm/uploads/media/x.jpg')
    })
    it('joins when only url has basePath (origin without basePath)', () => {
      expect(publicUrl('https://example.com', '/lawfirm/uploads/media/x.jpg'))
        .toBe('https://example.com/lawfirm/uploads/media/x.jpg')
    })
  })

  describe('production scenario (deshanxinyi)', () => {
    it('handles NEXT_PUBLIC_SITE_URL + /lawfirm/uploads/media/', () => {
      expect(publicUrl('https://www.deshanxinyi.com', '/lawfirm/uploads/media/1730-foo.jpg'))
        .toBe('https://www.deshanxinyi.com/lawfirm/uploads/media/1730-foo.jpg')
    })
    it('idempotent against accidental trailing slash in env var', () => {
      expect(publicUrl('https://www.deshanxinyi.com/', '/lawfirm/uploads/media/1730-foo.jpg'))
        .toBe('https://www.deshanxinyi.com/lawfirm/uploads/media/1730-foo.jpg')
    })
    it('idempotent if env var wrongly contains /lawfirm (legacy config drift)', () => {
      expect(publicUrl('https://www.deshanxinyi.com/lawfirm', '/lawfirm/uploads/media/1730-foo.jpg'))
        .toBe('https://www.deshanxinyi.com/lawfirm/uploads/media/1730-foo.jpg')
    })
  })

  describe('edge cases', () => {
    it('empty url returns baseUrl (no slash)', () => {
      expect(publicUrl('https://example.com', ''))
        .toBe('https://example.com')
    })
    it('empty baseUrl returns url (no slash prefix)', () => {
      expect(publicUrl('', '/foo.jpg')).toBe('/foo.jpg')
    })
  })
})
