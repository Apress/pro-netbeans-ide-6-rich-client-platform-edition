$:.unshift File.join(File.dirname(__FILE__(,'..','lib')

require 'test/unit'
require 'new_class'
class TestNewClass < Test::Unit::TestCase
  def test_foo
    assert(false, 'Assertion was false.')
    flunk "TODO: Write test"
    # assert_equal("foo", bar)
  end
end