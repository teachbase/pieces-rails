# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'pieces/rails/version'

Gem::Specification.new do |spec|
  spec.name          = "pieces-rails"
  spec.version       = Pieces::Rails::VERSION
  spec.authors       = ["palkan"]
  spec.email         = ["dementiev.vm@gmail.com"]
  spec.summary       = %q{pieces.js for rails}
  spec.description   = ""
  spec.homepage      = ""
  spec.license       = "MIT"

  spec.files = Dir["{lib,vendor}/**/*"] + ["LICENSE.txt","README.md"]
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]

  spec.add_development_dependency "bundler", "~> 1.5"
  spec.add_development_dependency "rake"
end
