require 'pieces/rails/input_helper'

module Pieces
  module Rails
    def self.install_to_slim!
      shortcut = Slim::Parser.default_options[:shortcut]
      shortcut['@']  = { attr: 'data-pid'}
      shortcut['@@'] = { attr: 'data-component'}
      Slim::Engine.default_options[:merge_attrs]['data-pid']  = ' '
      Slim::Engine.default_options[:merge_attrs]['data-component'] = ' '
    end

    class Railtie < ::Rails::Railtie
      initializer "pieces.input_helper" do
        ActiveSupport.on_load(:action_view) do
          ActionView::Base.send(:include, Pieces::Rails::InputHelper)
        end
      end

      initializer "pieces.slim" do
        Pieces::Rails.install_to_slim! if defined?(Slim::Parser)
      end
    end
  end
end
