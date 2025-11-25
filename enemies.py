# enemies.py

import pygame
import math

class Enemy:
    def __init__(self, path):
        self.path = path
        self.x, self.y = path[0]
        self.path_index = 0
        self.health = 50
        self.speed = 1
        self.original_speed = 1 # Store original speed
        self.slowed = False
        self.slow_duration = 0  # Duration of slow effect

    def move(self):
        if self.path_index < len(self.path) - 1:
            target_x, target_y = self.path[self.path_index + 1]
            dx = target_x - self.x
            dy = target_y - self.y
            distance = math.sqrt(dx ** 2 + dy ** 2)

            if distance > self.speed:
                self.x += (dx / distance) * self.speed
                self.y += (dy / distance) * self.speed
            else:
                self.x = target_x
                self.y = target_y
                self.path_index += 1

    def draw(self, screen):
        pygame.draw.rect(screen, (255, 0, 0), (self.x, self.y, 20, 20))

    def slow(self):
        if not self.slowed:
            self.speed = self.speed * 0.5
            self.slowed = True
            self.slow_duration = 120  # Set slow duration to 2 seconds (60 frames per second)

    def unslow(self):
        if self.slowed:
            self.speed = self.original_speed
            self.slowed = False

    def update_slow(self):
        if self.slowed:
            self.slow_duration -= 1
            if self.slow_duration <= 0:
                self.unslow()

    def draw_slowed(self, screen):
        pygame.draw.circle(screen, (0, 255, 0), (int(self.x + 10), int(self.y + 10)), 15, 2)


class StrongEnemy(Enemy):
    def __init__(self, path):
        super().__init__(path)
        self.health = 150  # Increased health
        self.speed = 0.5
        self.original_speed = 0.5

    def draw(self, screen):
        pygame.draw.rect(screen, (255, 100, 100), (self.x, self.y, 30, 30))

class FastEnemy(Enemy):
    def __init__(self, path):
        super().__init__(path)
        self.health = 20  # Decreased health
        self.speed = 2
        self.original_speed = 2

    def draw(self, screen):
        pygame.draw.rect(screen, (0, 255, 255), (self.x, self.y, 15, 15))

        super().__init__(x, y)
        self.health = 20  # Decreased health
        self.speed = 2
        self.original_speed = 2

    def draw(self, screen):
        pygame.draw.rect(screen, (0, 255, 255), (self.x, self.y, 15, 15))

class StrongEnemy(Enemy):
    def __init__(self, x, y):
        super().__init__(x, y)
        self.health = 100
        self.speed = 0.5

    def draw(self, screen):
        pygame.draw.rect(screen, (255, 100, 100), (self.x, self.y, 30, 30))

        pygame.draw.rect(screen, (255, 0, 0), (self.x, self.y, 20, 20))
