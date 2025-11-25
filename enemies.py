# enemies.py

import pygame

class Enemy:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.health = 50
        self.speed = 1

    def move(self):
        self.x += self.speed

    def draw(self, screen):
        pygame.draw.rect(screen, (255, 0, 0), (self.x, self.y, 20, 20))

class StrongEnemy(Enemy):
    def __init__(self, x, y):
        super().__init__(x, y)
        self.health = 100
        self.speed = 0.5

    def draw(self, screen):
        pygame.draw.rect(screen, (255, 100, 100), (self.x, self.y, 30, 30))

        pygame.draw.rect(screen, (255, 0, 0), (self.x, self.y, 20, 20))
