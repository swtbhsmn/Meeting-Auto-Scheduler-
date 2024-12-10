DOCKER_COMPOSE = docker-compose
DOCKER_COMPOSE_FILE = docker-compose.yaml
CONTAINER_NAME = meeting-auto-scheduler
SHELL = sh

build:
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) build

up:
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) up

cup:
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) up --build

down:
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) down

clean:
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) down -v --remove-orphans

it:
	docker exec -it $(CONTAINER_NAME) $(SHELL)
