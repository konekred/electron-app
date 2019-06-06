const hello = () => ('hello')

describe('hello', () => {
  it('should output hello', () => {
    expect(hello()).toBe('hello')
  })
})
