module Pieces
  module Rails
    module PiHelper
      def pi_text_field(options={}, &block)
        merge_class! options, 'pi-text-input-wrap pi'
        content_tag(:div, nil, options) do
          concat capture(&block)
        end
      end

      def pi_select_field(name, val, placeholder='', items=[], options={})
        merge_class! options, "pi-select-field pi"
        merge_data! options, {:name => name, "default-value" => val}
        list_options = (options[:dropdown]||{}).merge(pid: "dropdown")
        merge_class! list_options, 'pi is-hidden list-container pi-select-list'
        options.delete :dropdown
        content_tag(:div, nil, options) do
          concat hidden_field_tag(nil,val)
          concat content_tag(:div, placeholder, class: 'pi placeholder', pid: "placeholder", data:{placeholder: placeholder})
          concat(
            content_tag(:div, nil, list_options) do
              content_tag(:ul, nil, class: 'list') do
                items.each do |item|
                  concat content_tag(:li, item[:name], {:class => 'item', "data-value" => item[:value]})
                end
              end
            end
          )
        end
      end

      def pi_search_field(name = 'keyword', placeholder ='', options = {})
        merge_class! options,'pi-search-field pi'
        content_tag(:div, nil, options) do
          concat content_tag(:i, nil, {:class => 'pi reset-btn fa fa-times', "data-on-click" => "@host.reset"})
          concat text_field_tag(name,nil,class: 'text-input', placeholder: placeholder)
        end
      end

      def pi_checkbox(name = nil, val = nil, label = '', options = {})
        merge_class! options,'pi-checkbox-wrap pi'
        content_tag(:div, nil, options) do
          concat hidden_field_tag(name, val)
          concat label
        end
      end

      def pi_stepper(options = {},&block)
        merge_class! options,'pi-stepper pi'
        content_tag(:div, nil, options) do
          concat capture(&block)
          concat content_tag(:span, nil, class: 'step step-up')
          concat content_tag(:span, nil, class: 'step step-down')
        end
      end

      def pi_file_upload(name=nil, label='', options = {})
        merge_class! options,'pi-file-input-wrap pi'
        content_tag(:div, nil, options) do
          concat label
          concat file_field_tag name, class: 'file-input', multiple: options[:multiple]
        end
      end

      protected
        def merge_class!(options,klass)
          options[:class] = (options[:class] ? "#{options[:class]} " : '') << klass
        end

        def merge_data!(options,data)
          options[:data] = (options[:data] ? options[:data] : {}).merge(data)
        end
    end
  end
end