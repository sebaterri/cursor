# towers.py

class Tower:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.damage = 10
        self.range = 100

    def draw(self, screen):
        pygame.draw.circle(screen, (0, 255, 0), (self.x, self.y), 20)
