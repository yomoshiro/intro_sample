require "test_helper"

class GameRecordsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get game_records_index_url
    assert_response :success
  end

  test "should get show" do
    get game_records_show_url
    assert_response :success
  end
end
