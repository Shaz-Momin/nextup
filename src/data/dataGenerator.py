import random
import json

players = []

for i in range(2, 61):
    player = {
        "id": i,
        "name": f"Player {i}",
        "phone": f"{random.randint(100, 999)}-{random.randint(100, 999)}-{random.randint(1000, 9999)}",
        "profilePhoto": f"https://randomuser.me/api/portraits/men/{i}.jpg",
        "sportsInfo": {
            "Basketball": {
                "position": random.choice(["Point Guard", "Shooting Guard", "Small Forward", "Power Forward", "Center"]),
                "skillLevel": random.randint(1, 5)
            },
            "Volleyball": {
                "position": random.choice(["Setter", "Libero", "Outside Hitter", "Middle Blocker", "Opposite"]),
                "skillLevel": random.randint(1, 5)
            },
            "Badminton": {
                "position": random.choice(["Singles", "Doubles"]),
                "skillLevel": random.randint(1, 5)
            }
        }
    }
    players.append(player)

with open('/Users/shazmomin/Documents/2023-24/Spring 2024/CS 378 Intro to HCI/Final Project/nextup/src/data/players.json', 'w') as file:
    json.dump(players, file, indent=4)