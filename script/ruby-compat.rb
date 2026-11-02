# Compass 1.0.3 still calls File.exists?, removed in Ruby 3.2+.
unless File.respond_to?(:exists?)
  File.define_singleton_method(:exists?, File.method(:exist?))
end
