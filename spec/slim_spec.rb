require 'spec_helper'

require 'slim'
Pieces::Rails.install_to_slim!

describe 'Slim shortcut' do

  it 'adds @data-pid alias' do
    expect(Slim::Template.new { '.pi@main' }.render).to eq(
      '<div class="pi" data-pid="main"></div>')
  end

  it 'adds @@data-view alias' do
    expect(Slim::Template.new { '.pi@@control' }.render).to eq(
      '<div class="pi" data-component="control"></div>')
  end

  it 'adds both @ and @@' do
    expect(Slim::Template.new { '.pi@a@@b' }.render).to eq(
      '<div class="pi" data-component="b" data-pid="a"></div>')
  end

end