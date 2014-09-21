require 'spec_helper'

describe HelpersController, type: :controller do
  render_views

  describe 'text_input' do
    it 'accepts blocks' do
      get :text_input
      expect(response).to be_success
      expect(response.body).to eq '<div class="pi-text-input-wrap pi">'+
        '<input class="text-input" id="test" name="test" type="text" value="1" />'+
          '</div>'
    end
  end

  describe 'search_field' do
    it 'should render search field' do
      get :search_field
      expect(response).to be_success
      expect(response.body).to eq '<div class="pi-search-field pi" pid="search">'+
        '<i class="pi reset-btn fa fa-times" data-on-click="@host.reset"></i>'+
        '<input class="text-input" id="test" name="test" placeholder="search" type="text" />'+
        '</div>'
    end
  end

  describe 'checkbox' do
    it 'should render checkbox' do
      get :checkbox
      expect(response).to be_success
      expect(response.body).to eq '<div class="pi-checkbox-wrap pi" pid="cb">'+
        '<input id="test" name="test" type="hidden" />'+
        'Label'+
        '</div>'
    end
  end

  describe 'file_upload' do
    it 'should render file_upload' do
      get :file_upload
      expect(response).to be_success
      expect(response.body).to eq '<div class="pi-file-input-wrap pi" multiple="multiple" pid="fu">'+
        'upload'+
        '<input class="file-input" id="test" multiple="multiple" name="test" type="file" />'+
        '</div>'
    end
  end

  describe 'select_field' do
    it 'should render empty select_field' do
      get :select_field_empty
      expect(response).to be_success
      expect(response.body).to eq '<div class="pi-select-field pi" data-default-value="1" data-name="test" pid="select_none">'+
        '<input id="" type="hidden" value="1" />'+
        '<div class="pi placeholder" data-placeholder="-choose-" pid="placeholder">-choose-</div>'+
        '<div class="pi is-hidden list-container pi-select-list" pid="dropdown">'+
        '<ul class="list"></ul>'+
        '</div></div>'
    end

    it 'should render non-empty select_field' do
      get :select_field
      expect(response).to be_success
      expect(response.body).to eq '<div class="pi-select-field pi" data-default-value="1" data-name="test" pid="select_sex">'+
        '<input id="" type="hidden" value="1" />'+
        '<div class="pi placeholder" data-placeholder="-choose-" pid="placeholder">-choose-</div>'+
        '<div class="pi is-hidden list-container pi-select-list" pid="dropdown">'+
        '<ul class="list">'+
        '<li class="item" data-value="1">male</li>'+
        '<li class="item" data-value="0">female</li>'+
        '</ul>'+
        '</div></div>'
    end

    it 'should render select_field with dropdown options' do
      get :select_field_list_options
      expect(response).to be_success
      expect(response.body).to eq '<div class="pi-select-field pi" data-default-value="1" data-name="test" pid="select_none">'+
        '<input id="" type="hidden" value="1" />'+
        '<div class="pi placeholder" data-placeholder="-choose-" pid="placeholder">-choose-</div>'+
        '<div class="my-drop pi is-hidden list-container pi-select-list" data-plugins="scrollable" pid="dropdown">'+
        '<ul class="list">'+
        '</ul>'+
        '</div></div>'
    end
  end

  describe 'stepper' do
    it 'accepts options' do
      get :stepper
      expect(response).to be_success
      expect(response.body).to eq '<div class="pi-stepper pi" data-max="100" data-min="0" data-step="10">'+
        '<input class="text-input" id="test" name="test" type="text" value="1" />'+
        '<span class="step step-up"></span>'+
        '<span class="step step-down"></span>'+
          '</div>'
    end
  end

  describe 'assets' do
    it 'should load assets' do
      get :assets
      expect(response).to be_success
      expect(response.body).to_not be_empty
    end
  end


end