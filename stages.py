# stages.py

class Stage:
    def __init__(self):
        self.enemies = []

    def add_enemy(self, enemy):
        self.enemies.append(enemy)

    def update(self):
        for enemy in self.enemies:
            enemy.move()

    def draw(self, screen):
        for enemy in self.enemies:
            enemy.draw(screen)
