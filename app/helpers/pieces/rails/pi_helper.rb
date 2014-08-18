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
        merge_data! options, {"on-change" => "@this.placeholder.text(e.data.value)"}
        content_tag(:div, nil, options) do
          concat hidden_field_tag(name,val)
          concat content_tag(:div, placeholder, class: 'pi placeholder', pid: "placeholder")
          concat(
            content_tag(:div, nil, class: 'pi is-hidden list-container pi-select-list', pid: "dropdown") do
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
          concat label_tag(name, label, class: 'checkbox-label')
        end
      end

      def pi_file_upload(name=nil, label='', options = {})
        merge_class! options,'pi-file-input-wrap pi'
        content_tag(:div, nil, options) do
          concat content_tag(:span, label)
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